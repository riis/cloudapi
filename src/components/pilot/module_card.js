import { Card, CardBody, Icon } from "@chakra-ui/react"
import { GrStatusGoodSmall } from 'react-icons/gr'

const ModuleCard = ({text, loaded}) => {

  return (
    <Card flexDir={'row'} flexGrow={1} m={1} alignItems="center">
      <CardBody>{text}</CardBody>
      <Icon as={GrStatusGoodSmall} color={(loaded) ? 'green.400' : 'red.600'} mx={2}/>
    </Card>
  )
}

export default ModuleCard