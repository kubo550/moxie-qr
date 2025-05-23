import {
    Box,
    Container,
    Stack,
    Text,
    useColorModeValue,
} from '@chakra-ui/react';
import {DARK_BG_COLOR} from "../Header/Header";

export const Footer = () => {
    const currentYear = new Date().getFullYear();
    return (
        <Box
            bg={useColorModeValue('gray.50', DARK_BG_COLOR)}
            color={useColorModeValue('gray.700', 'gray.200')}
            display={'flex'}
            flexDirection={'column'}

        >
            <Box>
                <Container
                    as={Stack}
                    maxW={'6xl'}
                    py={4}
                    direction={{base: 'column', md: 'row'}}
                    spacing={4}
                    justify={{base: 'center', md: 'space-between'}}
                    align={{base: 'center', md: 'center'}}>
                    <Text>© {currentYear} MOXIE</Text>

                    <Text display={{default: 'none', md: 'block'}}>
                        Powered by{' '} <a href="https://www.linkedin.com/in/jakub-kurdziel-449714205/"
                                           target="_blank"
                                           rel="noopener noreferrer">Jakub Kurdziel</a>
                    </Text>

                </Container>
            </Box>
        </Box>
    );
}