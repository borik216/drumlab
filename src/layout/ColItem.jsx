export default function ColItem({noBorder, width, children}) {

    let className = 'flex-1'
    if (width) className = `w-${width}`
    if (!noBorder) className += ' border-r border-zinc-500'

    return (
        <div className={className}>
                {children}
        </div>
    )
}