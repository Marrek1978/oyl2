



export const saveBtnText = (isNew: boolean, isSubmitting: boolean, itemType: string): string => {
  return isSubmitting
    ? 'Updating...'
    : isNew
      ? `Create ${itemType}`
      : "Save Changes"
}


export const headerText = (isNew: boolean, itemType: string, title: string): JSX.Element => {
  return isNew
    ? <>{`Create New ${itemType}`}</>
    : (<>
      <div>
        <span className='text-sm' >
          {`Edit ${itemType}:`}
        </span>
      </div>
      <div>
        {title}
      </div>
    </>)
}