import { Card, Text } from "@chakra-ui/react";

const DeviceCard = ({device}) => {

  return (
    <Card role={"button"} p={2} my={2}>
      <Text fontSize={"xl"} as={"b"}>{device.device_name}</Text>
      <Text fontSize="sm" color={"gray.500"}>{device.device_sn}</Text>
      <Text fontSize="xs" color={"gray.500"}>{device.bound_time}</Text>
    </Card>
  )

}

export default DeviceCard;