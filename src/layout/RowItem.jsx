export default function RowItem({topBorder, noBorder, height, bgColor,children}) {

    let className = 'h-8 ' 
    if(height) className = `h-${height}`
    if(!noBorder) className += ' border-b border-black'
    if(topBorder) className += ' border-t border-r border-black'
    if(bgColor) className += `bg-${bgColor}`

    return (
        <div className={className}>
                {children}
        </div>
    )
}