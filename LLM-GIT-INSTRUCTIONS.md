#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════
# LLM Git instructions — veri-build-site
# ═══════════════════════════════════════════════════════════
#
# This site uses a dedicated deploy key stored in .ssh-keys/.
# That directory is .gitignore'd so the private key never
# gets committed.  Use the config below for any git push/pull.
#
# ── Setup (one-time) ──────────────────────────────────────
#   1. Add the public key (.ssh-keys/deploy-key.pub) as a
#      deploy key on GitHub under Settings → Deploy keys.
#   2. Set up a host alias in ~/.ssh/config:
#
#        Host github-veri-site
#            HostName github.com
#            User git
#            IdentityFile /path/to/veri-build-site/.ssh-keys/deploy-key
#
# ── Daily use ─────────────────────────────────────────────
#   git push git@github-veri-site:devbali/veri-build-site.git
#   git pull git@github-veri-site:devbali/veri-build-site.git
#
# The host alias avoids confusion with any other GitHub keys.
# ═══════════════════════════════════════════════════════════
