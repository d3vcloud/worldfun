import { createContext, Dispatch, SetStateAction, useContext, useState } from 'react'
import { savePreferencesGame } from 'services/game'
import { saveRoom } from 'services/room'
import { Room } from 'types/room'
import { useStep } from './StepContext'

type GameState = {
  room: Room
  setRoom: Dispatch<SetStateAction<Room>>
  saveRoomOnDatabase: () => Promise<void>
}

const GameContext = createContext<GameState | undefined>(undefined)

type Props = {
  children: JSX.Element
}

const roomInitialValue = {
  name: '',
  code: ''
}

export const GameProvider = ({ children }: Props) => {
  const [room, setRoom] = useState<Room>(roomInitialValue)
  const { preferences } = useStep()

  const saveRoomOnDatabase = async () => {
    if (room) {
      const { code, name } = room
      const data: Room = {
        code,
        name
      }
      await saveRoom(data)
      // HERE SET ID ROOM
      console.log(preferences)
    }
  }

  const savePreferencesGameOnDatabase = async (roomId: Room['id']) => {
    const { categoryName, mode, difficulty } = preferences
    const gamePreferences = {
      difficulty,
      category: categoryName,
      mode,
      roomId
    }
    // Save preferences of database
    await savePreferencesGame(gamePreferences)
  }

  const valuesContext = {
    room,
    setRoom,
    saveRoomOnDatabase
  }
  return <GameContext.Provider value={valuesContext}>{children}</GameContext.Provider>
}

export const useGame = () => {
  const context = useContext(GameContext)
  if (context === undefined) throw new Error('useGame must be used within a GameProvider')
  return context
}
