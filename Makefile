.PHONY: init clean deploy run

init:
	firebase init hosing
clean:
	@find public -mindepth 1 ! -name '.gitkeep' -delete 2>/dev/null || true
	@echo "Cleaned public directory (kept .gitkeep)"
deploy:
	@find public -mindepth 1 ! -name '.gitkeep' -delete 2>/dev/null || true
	hugo
	firebase deploy
run:
	@find public -mindepth 1 ! -name '.gitkeep' -delete 2>/dev/null || true
	hugo server -D