import NextLink from "next/link";
import { Box, Section, Button, Link, Separator, Text, Container } from "@radix-ui/themes";
import { ArrowRightIcon } from "@radix-ui/react-icons";

export default function Landing() {
  return (
    <Box>
      <header>
        <nav className="flex p-4">
          <Link href="#" size="6" weight="bold" color="ruby">
            Zenith
          </Link>
          <div className="grow"></div>
          <NextLink href="/api/auth/login">
            <Button size="2" variant="soft" color="ruby">
              Login / Sign Up
            </Button>
          </NextLink>
        </nav>
        <Separator size="4" />
      </header>
      <Container px="4">
        <Section pt="8" size="1">
          <div className="flex flex-col justify-center items-center">
            <Text size="9" weight="bold" align="center" wrap="pretty" className="bg-gradient-to-r from-purple-500 to-red-600 text-4xl font-bold p-4 bg-clip-text text-transparent">Zenith</Text>
            <Text size="6" wrap="balance" align="center" className="p-8">Empowering AI-driven learning with intelligent conversation and personalized assistance</Text>
            <NextLink href="/api/auth/login">
              <Button size="3" color="ruby">
                Get Started
                <ArrowRightIcon />
              </Button>
            </NextLink>
          </div>
        </Section>
      </Container>
      <Section size="1">
        <div className="flex justify-center">
          <img src="/landing.jpg" alt="Landing Image" className="w-4/5 rounded-lg border-solid border-2 border-[#484848] shadow-2xl shadow-cyan-500/50 grayscale-[25%]" />
        </div>
      </Section>
    </Box>
  );
}
