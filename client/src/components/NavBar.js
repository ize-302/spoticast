import React from 'react'
import { Box, Flex, SlideFade, useDisclosure, Avatar, Divider, Button, Icon, Stack, Input, InputGroup, Text, InputLeftElement } from '@chakra-ui/react'
import { MdOutlineSearch } from "react-icons/md";
import { getUser, logout } from '../spotify';
import { catchErrors } from '../utils';
import { navigate } from "@reach/router"
import { FaSpotify, FaArrowLeft } from "react-icons/fa";

const NavBar = () => {
  const { isOpen, onToggle } = useDisclosure()
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    onToggle()
  }, []);

  React.useEffect(() => {
    const fetchData = async () => {
      const response = await getUser();
      setUser(response.data);
    };
    catchErrors(fetchData());
  }, []);


  return (
    <Box zIndex={1} width="100%" bg="#070707" position="sticky" top="0" paddingY="15px">
      <SlideFade offsetY='-20px' in={isOpen}>
        <Flex maxW="1200px" paddingX={3} margin="0 auto" justifyContent="space-between" alignItems="center">
          <Icon color="brand.spotify-green" cursor='pointer' onClick={() => navigate('/')} w={[8, 12]} height={[8, 12]} as={FaSpotify} />
          {/* <Stack alignItems='center' direction='row' cursor='pointer' onClick={() => window.history.go(-2)}>
            <Icon color="brand.spotify-green" w={[5, 8]} height={[5, 8]} as={FaArrowLeft} marginRight={1} />
            <Text color="brand.spotify-green" fontWeight={600}>Back</Text>
          </Stack> */}
          <InputGroup rounded="lg" display={['none', 'none', 'block']} maxW="400px" bg="#111">
            <InputLeftElement
              pointerEvents='none'
              children={<MdOutlineSearch size={24} color='#666' />}
            />
            <Input onKeyUp={(e) => navigate(`/search?q=${e.target.value}`)} variant='outline' _focus={{'borderColor': 'brand.spotify-green'}} borderColor="transparent" type='tel' placeholder='Find podcast' />
          </InputGroup>
          <Stack direction='row' h='30px' gap={[1,3]} alignItems="center">
            <Avatar width={[8, 10]}  height={[8, 10]} src={user?.images[0].url} />
            <Divider color="red.200" orientation='vertical' />
            <Button variant="ghost" height="100%" padding="0" _hover={{ 'background': 'transparent' }} onClick={() => logout()}>Logout</Button>
          </Stack>
        </Flex>
      </SlideFade>
    </Box>
  );
}

export default NavBar;