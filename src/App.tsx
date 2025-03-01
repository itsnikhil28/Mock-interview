import React from 'react'
import { Button } from './components/ui/button'

function App() {
    return (
        <>
            <div className='text-blue-400'>App</div>
            <Button variant={'destructive'} className='w-screen h-screen text-end'>Click Me</Button>
        </>
    )
}

export default App