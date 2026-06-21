.PHONY: init clean deploy run

init:
	firebase init hosing
clean:
	@find public -mindepth 1 ! -name '.gitkeep' -delete 2>/dev/null || true
	@echo "Cleaned public directory (kept .gitkeep)"
deploy:
	@find public -mindepth 1 ! -name '.gitkeep' -delete 2>/dev/null || true
	@# Drop Hugo's cached remote fetches so each deploy re-pulls the latest
	@# Filmarks/Zenn/sizu/iTunes data (image resize caches are left intact).
	@cachedir=$$(hugo config | sed -n "s/^cachedir = '\(.*\)'/\1/p"); \
		[ -n "$$cachedir" ] && find "$$cachedir" -type d -name getresource -exec rm -rf {} + 2>/dev/null; true
	hugo
	firebase deploy
run:
	@find public -mindepth 1 ! -name '.gitkeep' -delete 2>/dev/null || true
	hugo server -D