import { useCallback, useEffect, useRef, useState } from 'react'
import kron from './assets/kron.png'
import mynt from './assets/mynt.png'

function App() {
	const [count, setCount] = useState(3)
	const [stage, setStage] = useState(0)

	const [data, setData] = useState<boolean[]>([])

	const [round, setRound] = useState(0)

	const dataSum = data.reduce((sum, value) => sum + (value as any), 0)
	const countIsValid = count % 2 && count > 0
	const won = dataSum / count >= 0.5

	const cb = useCallback(() => {
		setData([...data, Math.random() >= 0.5])
		setRound(round + 1)

		if (round >= count - 1) {
			setTimeout(() => {
				setStage(stage + 1)
			}, 500)
		}
	}, [round])

	const gameRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (gameRef.current) {
			if (round) {
				gameRef.current.classList.add('anim')
				setTimeout(() => {
					if (gameRef.current) {
						gameRef.current.classList.remove('anim')
					}
				}, 1000)
			}
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
					<div className='game' ref={gameRef}>
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
					<div className='results'>
						<h1>Dine resultater er... </h1>
						<h1 className={`result-text ${won && 'won'}`}>
							{won ? 'DU VINNER!' : 'Du tapte :,)'}
						</h1>
					</div>,
				][stage]
			}
			{stage >= 1 && (
				<div className={`progress ${stage === 2 && 'blur'}`}>
					{stage === 1 ? (
						<div
							className='main-progress'
							style={{ width: `${(100 * (round + 1)) / (count + 1)}%` }}></div>
					) : (
						data.map((value, index) => (
							<div
								className={`element ${value ? 'correct' : 'incorrect'}`}
								key={index}></div>
						))
					)}
				</div>
			)}
		</main>
	)
}

export default App
