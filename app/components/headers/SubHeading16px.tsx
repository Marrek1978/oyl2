
function SubHeading16px({ text , daisyUIColor='info', upperCase='uppercase'}: { text: string, daisyUIColor?: string, upperCase?: string}) {
  return (
    <>
      <div className={` font-bold font-mont tracking-wide ${upperCase} text-${daisyUIColor}`}>
        {text}
      </div>
    </>
  )
}

export default SubHeading16px