import { Card, Flex, Icon, Text } from "@chakra-ui/react";
import { GrStatusGoodSmall } from 'react-icons/gr'

const DeviceCard = ({ device, onClick = () => { } }) => {

  return (
    <Card role={"button"} p={2} my={2} onClick={() => onClick()}>
      <Flex dir="row" justifyContent='space-between' alignItems={'center'}>
        <Text fontSize={"xl"} as={"b"}>{device.device_name}</Text>
        <Icon as={GrStatusGoodSmall} color={(device.status) ? 'green.400' : 'red.600'} mx={2}/>
      </Flex>
      <Text fontSize="sm" color={"gray.500"}>{device.device_sn}</Text>
      <Text fontSize="xs" color={"gray.500"}>{device.bound_time}</Text>
    </Card>
  )

}

export default DeviceCard;