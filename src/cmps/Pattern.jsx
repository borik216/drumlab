
import { Draggable } from '@hello-pangea/dnd'


export default function Pattern({ pattern, index }) {

    let className = (isDragging) => {
        return `
                text-black 
                rounded-sm 
                w-16 
                m-1 
                text-center 
                border
                hover:bg-gray-300
                ${isDragging ? 'border-dotted' : 'border-solid'}
                ${isDragging ? 'border-rose-700' : ''}
                ${isDragging ? 'bg-gray-200' : 'bg-gray-100'}
                ${isDragging ? 'border-2' : 'border'}
                `
    }
    return (
        <Draggable draggableId={pattern.id} index={index}>
            {(provided, snapshot) => {
                return (
                    <span
                        className={className(snapshot.isDragging)}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                    >{pattern.display}
                    </span>
                )
            }
            }
        </Draggable>
    )
}