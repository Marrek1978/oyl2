import { useEffect, useState } from "react"




export const useSaveBtnText = (isNew: boolean, isIdle: boolean, itemType: string): string => {

  const [saveBtnText, setSaveBtnText] = useState<string>('')

  useEffect(() => {
    const result = !isIdle
      ? isNew
        ? 'Creating...'
        : 'Updating...'
      : isNew
        ? `Create ${itemType}`
        : "Save Changes"

    setSaveBtnText(result)
  }, [isNew, isIdle, itemType])

  return saveBtnText
}


export const headerText = (isNew: boolean, itemType: string, title: string): JSX.Element => {
  return isNew
    ? <>{`Create New ${itemType}`}</>
    : (<>
      <span className='text-sm mr-1' >{`Edit ${itemType}:`}</span> {title}
      {/* <div>
        <span className='text-sm' >
          {`Edit ${itemType}:`}
        </span>
      </div>
      <div>
        {title}
      </div> */}
    </>)
}