interface HeadingH1Props {
  H1Title: string;
}

function HeadingH1({ H1Title }: HeadingH1Props) {
  return (
    <>
      <div className='text-4xl font-normal font-mont tracking-wide'>
        {H1Title}
      </div>
    </>
  )
}

export default HeadingH1
