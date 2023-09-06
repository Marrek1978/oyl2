
function SubHeading16px({ text , daisyUIColor='info'}: { text: string, daisyUIColor?: string }) {
  return (
    <>
      <div className={` font-bold font-mont tracking-wide uppercase text-${daisyUIColor}`}>
        {text}
      </div>
    </>
  )
}

export default SubHeading16px