{
  inputs = {
    nixpkgs.url = "github:cachix/devenv-nixpkgs/rolling";
    systems.url = "github:nix-systems/default";
    devenv.url = "github:cachix/devenv";
    devenv.inputs.nixpkgs.follows = "nixpkgs";
  };

  nixConfig = {
    extra-trusted-public-keys = "devenv.cachix.org-1:w1cLUi8dv3hnoSPGAuibQv+f9TZLr6cv/Hm9XgU50cw=";
    extra-substituters = "https://devenv.cachix.org";
  };

  outputs = { self, nixpkgs, devenv, systems, ... } @ inputs:
    let
      forEachSystem = nixpkgs.lib.genAttrs (import systems);
    in
    {
      packages = forEachSystem (system: {
        devenv-up = self.devShells.${system}.default.config.procfileScript;
      });

      devShells = forEachSystem
        (system:
          let
            pkgs = nixpkgs.legacyPackages.${system};
          in
          {
            default = devenv.lib.mkShell {
              inherit inputs pkgs;
              modules = [
                {
                  # https://devenv.sh/reference/options/
                  packages = [
                    pkgs.nodePackages.typescript-language-server
                    pkgs.ollama
                    pkgs.prisma-engines
                    pkgs.openssl
                  ];

                  languages.javascript = {
                    enable = true;
                    npm = {
                      enable = true;
                    };
                  };

                  processes = {
                    ollama.exec = "ollama serve";
                  };

                  services.postgres = {
                    enable = true;
                    initialDatabases = [
                      { name = "llamasaasdb"; }
                    ];
                  };

                  env = {
                    PRISMA_QUERY_ENGINE_LIBRARY = "${pkgs.prisma-engines}/lib/libquery_engine.node";
                    PRISMA_QUERY_ENGINE_BINARY = "${pkgs.prisma-engines}/bin/query-engine";
                    PRISMA_SCHEMA_ENGINE_BINARY = "${pkgs.prisma-engines}/bin/schema-engine";
                    PRISMA_INTROSPECTION_ENGINE_BINARY = "${pkgs.prisma-engines}/bin/introspection-engine";
                    PRISMA_MIGRATION_ENGINE_BINARY = "${pkgs.prisma-engines}/bin/schema-engine";
                    PRISMA_FMT_BINARY = "${pkgs.prisma-engines}/bin/prisma-fmt";
                  };
                }
              ];
            };
          });
    };
}
