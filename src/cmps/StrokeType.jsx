import Up from '../svg-cmp/Up'
import Down from '../svg-cmp/Down'
import Full from '../svg-cmp/Full'
export default function StrokeType({stroke}) {
    let icon
    if (stroke === 'up') icon = <Up />
    if (stroke === 'down') icon = <Down />
    if (stroke === 'full') icon = <Full />
    if (stroke === 'tap') icon = (
    <span className='w-full h-8 relative before:block before:absolute before:w-2 before:h-2 before:-right-0.5 before:top-1 before:bg-ghost-blue before:rounded-full'>
        <span className='w-full h-8 opacity-0'>t</span>
    </span>)

    return (
        <span className='w-1/2'>
            {icon}
        </span>
    )
}

// className='absolute right-0.5 -bottom-0.5'