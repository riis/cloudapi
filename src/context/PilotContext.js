import { createContext } from "react"
import { EStatusValue } from "../api/enums"

const PilotContext = createContext()

const PilotContextProvider = ({ children }) => {

  const [pilot, setPilot] = useState({
    data: {
      sn: EStatusValue.DISCONNECT,
      online_status: false,
      device_callsign: '',
      user_id: '',
      user_callsign: '',
      bound_status: false,
      model: '',
      gateway_sn: EStatusValue.DISCONNECT,
      domain: ''
    }
  })

  return <PilotContext.Provider value={{pilot, setPilot}}>
    {children}
  </PilotContext.Provider>


}

export default PilotContextProvider