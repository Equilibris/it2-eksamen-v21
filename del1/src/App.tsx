import { useCallback, useRef, useState } from 'react'
import kron from './assets/kron.png'
import mynt from './assets/mynt.png'

function App() {
	const [count, setCount] = useState(3)
	const [stage, setStage] = useState(0)

	const data = useRef<boolean[]>([])

	const [round, setRound] = useState(0)

	const countIsValid = count % 2 && count > 0

	const cb = useCallback(() => {
		data.current.push(Math.random() >= 0.5)
		setRound(round + 1)

		if (round >= count - 1) {
			setStage(stage + 1)
		}
	}, [round])

	return (
		<main>
			{
				[
					<div>
						<h1>Mynt gjette spill</h1>
						<div>
							<h2>Antall runder:</h2>
							<div className='input-container'>
								<input
									type='number'
									name='antall runder'
									defaultValue='3'
									onChange={(val) => {
										setCount(+val.currentTarget.value)
									}}
								/>
								<button
									onClick={() => {
										if (countIsValid) setStage(stage + 1)
									}}>
									Start spill
								</button>
							</div>

							<h3 className='error' style={{ opacity: +!countIsValid }}>
								Antallet må være et <br />
								positivt oddetall
							</h3>
						</div>
					</div>,
					<div className='game'>
						<h1>Runde {round + 1}</h1>

						<div>
							<button onClick={cb}>
								<img src={kron} alt='kron' />
								<p>kron</p>
							</button>

							<button onClick={cb}>
								<img src={mynt} alt='mynt' />
								<p>mynt</p>
							</button>
						</div>
					</div>,
				][stage]
			}
		</main>
	)
}

export default App
