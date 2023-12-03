import { Droppable } from '@hello-pangea/dnd'
import Pattern from './Pattern'
import stickingPatterns from '../data/sticking-patterns.js'
import Header from './Header'



export default function StickingPatterns() {

    return (
        <Droppable droppableId="sticking-patterns">
            {(provided, snapshot) => (
                <>
                    <Header text={'1/4 Patterns'} />
                    <div className='flex flex-wrap items-center mx-auto mb-4 max-w-3xl' ref={provided.innerRef} >

                        {stickingPatterns.filter(pattern => pattern.sticking.length === 4).map((pattern, index) => {
                            return <Pattern pattern={pattern} key={pattern.id} index={index} />
                        })}
                    </div>
                    <Header text={'1/3 Patterns'} />
                    <div className='flex flex-wrap items-center mx-auto mb-4 max-w-3xl' ref={provided.innerRef} >
                        {stickingPatterns.filter(pattern => pattern.sticking.length === 3).map((pattern, index) => {
                            return <Pattern pattern={pattern} key={pattern.id} index={index} />
                        })}
                    </div>
                </>
            )}
        </Droppable>
    )
}
