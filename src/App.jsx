import StickingPatterns from './cmps/StickingPatterns'
import PatternPlayer from './cmps/PatternPlayer'
import './App.css'
import PatternContextProvider from './context/PatternContextProvider.jsx'


function App() {

  return (
    <PatternContextProvider>
      <div className='app'>
        <StickingPatterns />
        <PatternPlayer />
      </div>
    </PatternContextProvider>
  )
}

export default App
