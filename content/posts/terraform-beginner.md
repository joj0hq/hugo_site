+++
categories = ["AWS"]
tags = ["terraform", "aws", "beginner"]
date = "2019-07-15"
description = ""
featured = "terraform-beginner.png"
featuredalt = "terraform"
featuredpath = "date"
linktitle = ""
title = "【AWS入門】terraformでVPC+EC2構築を自動化する"
type = "post"

+++

## 今回作るシンプルなインフラ設計

AWS でインフラ構築をする時は、毎回**ブラウザからコンソールをぽちぽち**するとセキュリティーグループやルートテーブルの設定に抜け漏れができてしまったりということが多く困っていました。

そのため、今回はコードを書いて実行するだけでインフラ環境を構築してくれるツール「**Terraform**」を使って構築の自動化をしていきます。

まず、完成図から見ていきましょう。

![terrafom](/images/2019/07/terraform1.png)

このように VPC に EC2 が乗っているだけの**もっともシンプルな設計**で作っていきます。

## Terraform とは

そもそも「**Terraform**」とは何かについて簡単に説明します。

Vagrant を開発している[HashiCorp 社](https://www.hashicorp.com/)が開発しているツールで公式 HP によると、

> HashiCorp Terraform enables you to safely and predictably create, change, and improve infrastructure. It is an open source tool that codifies APIs into declarative configuration files that can be shared amongst team members, treated as code, edited, reviewed, and versioned.
> https://www.terraform.io/

つまり、Terraform とは**安全かつ予測可能にインフラ設計を作成／変更／改善がコードとして扱うことができるオープンソースツール**です。

![terrafom](/images/2019/07/terraform2.png)

これを使うことでコードからインフラ環境を構築でき、削除をコマンドひとつで簡単にできます。

ブラウザ構築を行う際にはコンソールから**ぽちぽち**設定を行わなければいけないとの、立ち上げた環境を潰したい時も**いちいちひとつずつ削除**しなければいけないというデメリットがありますが Terraform を使うことでこれらの課題を解決してくれます。

一度設計したインフラ構造を使いまわすこともできるので、使いこなすことができるととても便利なツールです。

## インフラ構築の手順

それでは、順を追って Terraform によるインフラ構築を行なっていきましょう。

### Terraform のインストール

今回、Mac を使用しているので、

```sh
brew install terraform
```

でサクッと Terraform を**インストール**することができます。

Terraform をインストールすることができているかを確認するために、

```sh
terraform version
```

この**コマンドが通るか確認**しましょう。これで準備 OK です。

### 準備： API キーの取得

Terraform を使うために AWS を外部から扱うための**API キー**が必要です。

API キーを取得は、**IAM ユーザー**ごとに行えるので事前に作っておいてください。

作成したブラウザから IAM ユーザーページの認証情報から「**アクセスキーの作成**」を行なってください。

![terrafom](/images/2019/07/terraform3.png)

これを行うと、**アクセスキー ID とシークレットキー ID**が作成されます。シークレットキー ID は一時的に表示されるだけなのでしっかりとメモしておきましょう。

### 作成するファイル

それでは、VPC+EC2 のシンプルな環境を設計するのに**必要なファイル**をリストアップしていきます。

- terraform.tfvars
- aws.tf
- vpc.tf
- ec2.tf

**tf ファイル**や terraform の変数設定を行う**tfvars ファイル**は同じディレクトリ内に配置すると**自動的に読み込まれます**。

そのため、ファイル名も自由に設定できますし、そもそもファイルを分けなくても問題はありませんが、今回は**可読性と汎用性**を考慮してファイルを分けています。

#### terraform.tfvars

**拡張子を「.tfvars」とすると、terraform を使用する際の変数を定義する**ことができます。

「.tf」でも変数を定義することはできますが、環境変数のように Git にあげたくない変数をこのファイルに定義していきます。

```
aws_access_key = "XXXXX" // your access key
aws_secret_key = "XXXXX" // your secret key
aws_region = "ap-northeast-1"
server_name = "test-terraform"
key_name = "XXXXXXXX" // key pair
network_part_ip = "0"
aws_zone = "ap-northeast-1a"
amazon_linux_2_ami = "ami-0d7ed3ddb85b521a6"
```

このように先ほど取得した**アクセスキーやシークレットキー**を設定しておきます。

この表がそれぞれの変数が意味している内容です。

| 変数名             | 内容                                                                |
| ------------------ | ------------------------------------------------------------------- |
| aws_access_key     | アクセスキー ID                                                     |
| aws_secret_key     | シークレットキー ID                                                 |
| aws_region         | リージョン名                                                        |
| server_name        | サーバー名（※ EC2 に名前をつけるときなどに使用）                    |
| key_name           | キーペア名（※ 今回はすでに作成済み）                                |
| network_part_ip    | ネットワーク部の IP（10.2.0.0/16 で VPC を作成する場合,この値は 2） |
| aws_zone           | アベイラビリティーゾーン名                                          |
| amazon_linux_2_ami | amazon linux 2 のイメージ ID                                        |

複数のインフラ設計を同一アカウントで行う際に識別しやすくするためにタグを用いてセキュリティーグループやルートテーブルに名前を付与するので、server_name はその時に使用する**名前の接頭辞**としてをあらかじめ定義しています。

EC2 を立ち上げる際に、EC2 へのアクセスに必要な**キーペア**を設定します。

Terraform から新規作成することもできますが、今回は既存のキーペアを使用します。そのため、**key_name には使用するキーペア名**を記入してください。

キーペアを持っていない人はコンソールから「**キーペアの作成**」を行いましょう。

![terrafom](/images/2019/07/terraform4.png)

ここでは秘密鍵をダウンロードして、SSH 接続を行う PC の**~/.ssh のディレクトリ内に保存**しておきましょう。

#### aws.tf

このファイルには使用する変数の宣言と API の初期設定を管理しています。それでは、aws.tf のコードを見ていきましょう。

```
// use tfvars
variable "aws_access_key" {}
variable "aws_secret_key" {}
variable "server_name" {}
variable "aws_region" {}
variable "key_name" {}
variable "aws_zone" {}
variable "network_part_ip" {}
variable "amazon_linux_2_ami" {}

// init
provider "aws" {
  access_key = "${var.aws_access_key}"
  secret_key = "${var.aws_secret_key}"
  region     = "${var.aws_region}"
}
```

ここに書かれているコードの

```
variable "XXXXX" {}
```

の部分は**terraform.tfvars**で定義した変数を使用することを宣言しています。

以降は以下のように呼び出すことができます。

```
"${var.XXXXX}"
```

provider には使用する**アクセスキーとシークレットキー、そしてリージョン**を設定する必要があります。

#### vpc.tf

次に VPC の設定を行なっていきます。

```
// vpc
resource "aws_vpc" "vpc" {
  cidr_block = "10.${var.network_part_ip}.0.0/16"
  enable_dns_support = true
  enable_dns_hostnames = true
  tags {
    Name = "${var.server_name}-vpc"
  }
}

// internet gateway
resource "aws_internet_gateway" "igw" {
  vpc_id = "${aws_vpc.vpc.id}"

  tags {
    Name = "${var.server_name}-igw"
  }
}
```

terraform では、EC2 や RDS、セキュリティーグループ、VPC など全てのリソースの設定は

```
resource "メソッド名" "変数名" {
 // 詳細な設定をここに記載する
}
```

このように書いていきます。どのようなメソッドがあるのかは[公式ドキュメント](https://www.terraform.io/docs/providers/aws/d/vpc.html)に記載されているので目を通してみてください。

VPC についての詳細設定以下にまとめます。

| キー                 | 内容                                                                |
| -------------------- | ------------------------------------------------------------------- |
| cidr_block           | VPC で使用するサイダーブロック（例：10.0.0.0/16）                   |
| enable_dns_support   | VPC に対して DNS 解決がサポートされているかどうか                   |
| enable_dns_hostnames | VPC 内に起動されるインスタンスがパブリック DNS ホスト名を取得するか |
| tags                 | タグ（Name を設定することができる）                                 |

​

次にインターネットゲートウェイの詳細設定です。

| キー   | 内容                                     |
| ------ | ---------------------------------------- |
| vpc_id | インターネットゲートウェイを付与する VPC |
| tags   | タグ（Name を設定することができる）      |

​

#### ec2.tf

次に EC2 についての設定です。

```
// subnet
resource "aws_subnet" "public-subnet" {
  vpc_id            = "${aws_vpc.vpc.id}"
  cidr_block        = "10.${var.network_part_ip}.1.0/24"
  availability_zone = "${var.aws_zone}"
  tags {
    Name = "${var.server_name}-public-subnet"
  }
}

// route table
resource "aws_route_table" "public-route" {
  vpc_id = "${aws_vpc.vpc.id}"
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = "${aws_internet_gateway.igw.id}"
  }
  tags {
    Name = "${var.server_name}-public-route"
  }
}

// route table association
resource "aws_route_table_association" "public-ec2-route" {
  subnet_id = "${aws_subnet.public-subnet.id}"
  route_table_id = "${aws_route_table.public-route.id}"
}

// security group
resource "aws_security_group" "public-ec2-sg" {
  name = "public-ec2-sg" // group name
  description = "for public-ec2"
  vpc_id = "${aws_vpc.vpc.id}"
  ingress {
    from_port = 80
    to_port = 80
    protocol = "tcp"
    //    self = true
    cidr_blocks = ["0.0.0.0/0"]
  }
  ingress {
    from_port = 443
    to_port = 443
    protocol = "tcp"
    //    self = true
    cidr_blocks = ["0.0.0.0/0"]
  }
  ingress {
    from_port = 22
    to_port = 22
    protocol = "tcp"
    //    self = true
    cidr_blocks = ["0.0.0.0/0"]
  }
  egress {
    from_port = 0
    to_port = 0
    protocol = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
  tags {
    Name = "${var.server_name}-public-ec2-sg"
  }
}

// ec2
resource "aws_instance" "public-ec2" {
  ami = "${var.amazon_linux_2_ami}"
  instance_type = "t2.micro"
  vpc_security_group_ids = ["${aws_security_group.public-ec2-sg.id}"]
  subnet_id = "${aws_subnet.public-subnet.id}"
  associate_public_ip_address = false
  key_name = "${var.key_name}"
  root_block_device = {
    volume_type = "gp2"
    volume_size = "8" // GB
    delete_on_termination = true
  }
  tags {
    Name = "${var.server_name}-public-ec2"
  }
}
```

EC2 を構築するには、

- **サブネット**

- **ルートテーブル**

- **セキュリティーグループ**

  この 3 つを構築しなければいけません。

まずはサブネットです。

| キー              | 内容                                |
| ----------------- | ----------------------------------- |
| vpc_id            | 使用する VPC                        |
| cidr_block        | サイダーブロック（例：10.0.1.0/24） |
| availability_zone | 使用するアベイラビリティーゾーン    |
| tags              | タグ（Name を設定することができる） |

次にルートテーブルです。

| キー               | 内容                                |
| ------------------ | ----------------------------------- |
| vpc_id             | 使用する VPC                        |
| route > cidr_block | サイダーブロック（例：0.0.0.0/0）   |
| route > gateway_id | 使用するインターネットゲートウェイ  |
| tags               | タグ（Name を設定することができる） |

​

**ルートテーブルとサブネットを関連づける**必要があるので、aws_route_table_association で設定を行います。

| キー           | 内容                     |
| -------------- | ------------------------ |
| subnet_id      | 関連づけるサブネット     |
| route_table_id | 関連づけるルートテーブル |

そして、セキュリティーグループです。

| キー        | 内容                                |
| ----------- | ----------------------------------- |
| name        | グループ名                          |
| description | コメント                            |
| vpc_id      | 使用する VPC                        |
| ingress     | インバウンドの設定（以下に詳細）    |
| egress      | アウトバウンドの設定（以下に詳細）  |
| tags        | タグ（Name を設定することができる） |

​

ingress も egress も同じキーを使用して**インバウンドとアウトバウンド**を設定します。

| キー        | 内容                                                     |
| ----------- | -------------------------------------------------------- |
| to_port     | 最初のポート（どのポートからどのポートまで受け入れるか） |
| from_port   | 最後のポート（どのポートからどのポートまで受け入れるか） |
| protocol    | プロトコル（例：TCP, SSH）                               |
| cidr_blocks | サイダーブロック（例：0.0.0.0/16）                       |

最後に EC2 の設定です。

| キー                        | 内容                                |
| --------------------------- | ----------------------------------- |
| ami                         | 使用するイメージ                    |
| instance_type               | インスタンスタイプ（例：t2.micro）  |
| vpc_security_group_ids      | 使用するセキュリティーグループ      |
| subnet_id                   | 使用するサブネット                  |
| associate_public_ip_address | パブリック IP と関連づけるか        |
| key_name                    | キーペア名                          |
| root_block_device           | EBS の設定（以下に詳細）            |
| tags                        | タグ（Name を設定することができる） |

​

**初期の EBS の容量**などを root_block_device で以下のように設定します。

| キー                  | 内容                                |
| --------------------- | ----------------------------------- |
| volume_type           | ボリュームタイプ（例：gp2）         |
| volume_size           | ボリュームサイズ（単位は GB）       |
| delete_on_termination | EC2 削除時に EBS も一緒に削除するか |

​

### Terraform コマンドでインフラ構築

これで全てのファイルの作成が終わりました。

最後に terraform のコマンドで作成したコードからインフラ構築を行いましょう。

はじめに tf ファイルを保存しているディレクトリへ移動して、この**コマンド**を実行してください。

```sh
terraform init
```

すると初期化が行われて、次のようになります。

```
Initializing provider plugins... - Checking for available provider plugins on https://releases.hashicorp.com... - Downloading plugin for provider "aws" (1.58.0)... The following providers do not have any version constraints in configuration, so the latest version was installed. To prevent automatic upgrades to new major versions that may contain breaking changes, it is recommended to add version = "..." constraints to the corresponding provider blocks in configuration, with the constraint strings suggested below. * provider.aws: version = "~> 1.58"
Terraform has been successfully initialized!
You may now begin working with Terraform. Try running "terraform plan" to see
any changes that are required for your infrastructure. All Terraform commands
should now work.
If you ever set or change modules or backend configuration for Terraform,
rerun this command to reinitialize your working directory. If you forget, other
commands will detect it and remind you to do so if necessary.
```

これにより、terraform をするために**初期設定が完了**しました。

terraform init をせずにいきなりドライランのためのコマンド「terraform plan」をしても、

```
Plugin reinitialization required. Please run "terraform init".
Reason: Could not satisfy plugin requirements.
Plugins are external binaries that Terraform uses to access and manipulate
resources. The configuration provided requires plugins which can't be located,
don't satisfy the version constraints, or are otherwise incompatible.
1 error(s) occurred:
* provider.aws: no suitable version installed
  version requirements: "(any version)"
  versions installed: none
Terraform automatically discovers provider requirements from your
configuration, including providers used in child modules. To see the
requirements and constraints from each module, run "terraform providers".

Error: error satisfying plugin requirements
```

このようなエラーが出るので気をつけましょう。

初期化が終われば後は、

```sh
terraform plan
```

で**ドライラン**をしてエラーがないことを確認して、

```sh
terraform apply
```

で環境構築を行いましょう。これで VPC+EC2 のインフラ環境を作ることができました。

もし、この環境を**全て削除したい**場合は、

```sh
terrraform destroy
```

で削除できます。このコマンドがめちゃくちゃ便利です。

また、**一部の環境を削除したい**時は

```sh
terraform destroy target=aws_instance.public-ec2
```

このような**target オプション**を使用すれば OK です。

他にも手動で環境に手を加えてしまった時に terraform に変更を適応させる

```sh
terraform refresh
```

などもあるので確認しておくと良いと思います。

## まとめ

今回は、terraform を使って**VPC+EC2 の超シンプルなインフラ環境を**構築しました。

![terrafom](/images/2019/07/terraform5.png)

terraform の基本的な使い方は理解してもらえたでしょうか。

これさえできれば、ロードバランサーやオートスケール、RDS、CloudFront などを含んだ環境も簡単に作れるようになるのでぜひ Terrform を使ってみてくださいね。
