import React from 'react';
import {Grid, Button} from "@chakra-ui/react"


const More = ({setNewOffset, oldOffset, label}) => {
  return (
    <Grid><Button onClick={() => setNewOffset(oldOffset+20)} cursor='pointer' bg="brand.spotify-green" color="#000" placeSelf="center">{label}</Button></Grid>
  );
}
 
export default More;