FROM nixos/nix
RUN nix-channel --update

COPY . .
RUN nix develop --impure -c sh -c "devenv up"
