interface HeadingH2Props {
  text: string;
}

function HeadingH2({ text }: HeadingH2Props) {
  return (
    <>
      <div className='text-2xl font-medium font-mont tracking-wide'>
        {text}
      </div>
    </>
  )
}

export default HeadingH2