import { useContext } from 'react'

import { UserContext } from '../../contexts/Auth/UserContext'
import Login from './LoginPage'

export default () => {
  const { signOut } = useContext(UserContext)
  return (
    <>
      <Login />
      <div>
        {' '}
        <button onClick={async () => await signOut()}>SignOut</button>
      </div>
    </>
  )
}
