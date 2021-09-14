import { Reducer, useEffect, useReducer, useRef, useState } from 'react'

const randomDigit = () => Math.round(Math.random() * 9)

const LARGEST_PRIZE = 5
const JOKER = Symbol('Joker')

type DataElement = number | typeof JOKER

type DataArray = DataElement[]

type Action = { type: 'up' } | { type: 'down' }

type NumData = {
	initialNum: number

	data: [DataArray, DataArray]

	history: boolean[]
}

// const evaluateData = ({ data, history, initialNum }: NumData) => {
// 	const evaluatedHistory = history.map((x, index) => data[+x][index])

// 	let val = 0
// 	let index = 0

// 	for (const element of evaluatedHistory) {
// 		if (element === JOKER) return JOKER

// 		val += element * 10 ** (evaluatedHistory.length - index - 1)
// 		index++
// 	}
// 	const dropDigits = 10 ** evaluatedHistory.length

// 	return Math.floor(initialNum / dropDigits) * dropDigits + val
// }

const evaluateData = ({
	data: [[...a], [...b]],
	history: [...history],
	initialNum,
}: NumData): DataElement => {
	const el = [a.pop(), b.pop()]

	const current = history.pop()

	if ([el[0], el[1], current].includes(undefined)) return initialNum

	const value = el[+current!]

	if (value === JOKER) return JOKER

	const next = evaluateData({
		data: [a, b],
		history,
		initialNum: Math.floor(initialNum / 10),
	})

	if (typeof next === 'number' && typeof value === 'number')
		return value + next * 10
	return JOKER
}

type State = NumData & {
	currentPrize: number
	goalNum: number
	stage: number
}

const reducer: Reducer<State, Action> = (state, { type }) => {
	switch (type) {
		case 'up': {
			const value = {
				...state,
				stage: state.stage + 1,
				history: [...state.history, true],
			}

			const data = evaluateData(value)

			if (data === JOKER)
				return { ...value, stage: 5, currentPrize: LARGEST_PRIZE }

			if (data >= state.goalNum)
				return { ...value, currentPrize: value.currentPrize + 1 }
			else
				return { ...value, currentPrize: Math.max(value.currentPrize - 1, 0) }
		}

		case 'down': {
			const value = {
				...state,
				stage: state.stage + 1,
				history: [...state.history, false],
			}

			const data = evaluateData(value)

			if (data === JOKER)
				return { ...value, stage: 5, currentPrize: LARGEST_PRIZE }

			if (data <= state.goalNum)
				return { ...value, currentPrize: value.currentPrize + 1 }
			else
				return { ...value, currentPrize: Math.max(value.currentPrize - 1, 0) }
		}
	}
}

function App() {
	const [state, dispatch] = useReducer(
		reducer,
		{
			goalNum: Math.round(Math.random() * 99999),
			initialNum: 0,
			data: [
				[
					randomDigit(),
					randomDigit(),
					randomDigit(),
					randomDigit(),
					randomDigit(),
				],
				[
					randomDigit(),
					randomDigit(),
					randomDigit(),
					randomDigit(),
					randomDigit(),
				],
			],
			history: [],
			currentPrize: 0,
			stage: 0,
		},
		(init: State) => {
			// do {
			init.initialNum = Math.round(Math.random() * 99999)
			// } while (init.initialNum === init.goalNum)

			init.data[Math.round(Math.random())][Math.round(Math.random() * 5)] =
				JOKER

			console.log(init)

			return init
		}
	)

	useEffect(() => {
		console.log(state)
	}, [state])

	const inverseStage = 4 - state.stage

	return (
		<main>
			<h1>Joker</h1>
			<div className='main'>
				{[...Array(5).keys()].map((x) =>
					x === inverseStage ? (
						<div
							className='top selected'
							onClick={() => dispatch({ type: 'up' })}></div>
					) : state.history[4 - x] ? (
						<div className={`top ${state.data[1][x] === JOKER && 'joker'}`}>
							{state.data[1][x]}
						</div>
					) : (
						<div className='concealed'></div>
					)
				)}

				{[...`${state.initialNum}`.padStart(5, '0')].map((x, index) => (
					<div className='num' key={`${index}-num`}>
						{x}
					</div>
				))}

				{[...Array(5).keys()].map((x) =>
					x === inverseStage ? (
						<div
							className='bot selected'
							onClick={() => dispatch({ type: 'down' })}></div>
					) : state.history[4 - x] === false ? (
						<div className={`bot ${state.data[0][x] === JOKER && 'joker'}`}>
							{state.data[0][x]}
						</div>
					) : (
						<div className='concealed'></div>
					)
				)}
			</div>
			<div className='premier'>
				<div
					className={`select`}
					style={{ left: `${23 * state.currentPrize}ch` }}></div>
				<h2>412 000 kr</h2>
				<h2>535 000 kr</h2>
				<h2>722 000 kr</h2>
				<h2>1 010 000 kr</h2>
				<h2>1 464 000 kr</h2>
				<h2>2 196 000 kr</h2>
			</div>
		</main>
	)
}

export default App
