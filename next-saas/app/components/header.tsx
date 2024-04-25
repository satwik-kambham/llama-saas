import { Box, Link, Button, Separator } from "@radix-ui/themes";
import NextLink from "next/link";

export default function Header() {
  return (
    <Box>
      <header>
        <nav className="flex p-4">
          <Link size="6" weight="bold" color="ruby">
            <NextLink href="/">
              Llama
            </NextLink>
          </Link>
          <div className="grow"></div>
          <Button size="2" variant="soft" color="ruby">
            Logout
          </Button>
        </nav>
        <Separator size="4" />
      </header>
    </Box>
  )
}

