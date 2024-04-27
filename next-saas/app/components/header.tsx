import { Box, Text, Button, Separator } from "@radix-ui/themes";
import NextLink from "next/link";

export default function Header() {
  return (
    <Box>
      <header>
        <nav className="flex p-4">
          <NextLink href="/">
            <Text size="6" weight="bold" color="ruby">
              Llama
            </Text>
          </NextLink>
          <div className="grow"></div>
          <NextLink href="/">
            <Button size="2" variant="soft" color="ruby">
              Logout
            </Button>
          </NextLink>
        </nav>
        <Separator size="4" />
      </header>
    </Box>
  )
}
