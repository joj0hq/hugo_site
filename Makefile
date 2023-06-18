init:
	firebase init hosing
deploy:
	hugo
	firebase deploy
run:
	hugo server -D