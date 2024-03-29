interface HeadingH2Props {
  text: string | React.ReactNode;
}

function HeadingH2({ text }: HeadingH2Props) {
  return (
    <>
      <div className='text-2xl font-medium font-mont tracking-wide wrap max-w-max'>
        {text}
      </div>
    </>
  )
}

export default HeadingH2