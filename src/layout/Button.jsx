import { useSelector, useDispatch } from "react-redux";

export default function DisableButton({className, hover, onClick, onContextMenu, children}) {
    const {isEditMode} = useSelector(state => state.player)
    className = isEditMode ? className + ' ' + hover : className

    return (
        <button onClick={onClick} className={className} disabled={!isEditMode} onContextMenu={onContextMenu && onContextMenu}>
            {children}
        </button>
    )
}