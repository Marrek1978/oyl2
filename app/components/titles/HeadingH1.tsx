interface HeadingH1Props {
  text: string;
}

function HeadingH1({ text }: HeadingH1Props) {
  return (
    <>
      <div className='text-4xl font-medium font-nanum tracking-wide'>
        {text}
      </div>
    </>
  )
}

export default HeadingH1
