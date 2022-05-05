import "./NiceApp.css"
import { v4 as uuid } from "uuid"
import { useState } from "react"
import { DragDropContext } from "react-beautiful-dnd"
import { Droppable } from "react-beautiful-dnd"
import { Draggable } from "react-beautiful-dnd"
import Axios from "axios"
import DataTable from "./DataTable"
import "bootstrap/dist/css/bootstrap.min.css"

export default function NiceApp() {
	const [globalResult, setGlobalResult] = useState()

	console.log("state changed")
	const itemsFromBackend = [
		{ id: uuid(), content: "SELECT" },
		{ id: uuid(), content: "*" },
		{ id: uuid(), content: "FROM" },
		{ id: uuid(), content: "EMPLOYEES" },
	]

	const columnsFromBackend = {
		[uuid()]: {
			name: "Blocks",
			items: itemsFromBackend,
		},
		[uuid()]: {
			name: "Final Query",
			items: [],
		},
	}
	const [columns, setColumns] = useState(columnsFromBackend)
	const [items, setItems] = useState(itemsFromBackend)
	const initialItems = itemsFromBackend
	const initialColumns = columnsFromBackend

	const dragEnd = (result) => {
		// for checking if the item has been dragged out of ctx
		if (!result.destination) {
			return
		}
		const { source, destination } = result
		// for drag and drop from one column to another
		if (source.droppableId !== destination.droppableId) {
			const sourceColumn = columns[source.droppableId]
			const destinationColumn = columns[destination.droppableId]
			const sourceItems = [...sourceColumn.items]
			const destinationItems = [...destinationColumn.items]
			const [removed] = sourceItems.splice(source.index, 1)
			destinationItems.splice(destination.index, 0, removed)

			// ? Debugging purposes only
			// console.log(`src col - ${JSON.stringify(sourceColumn)}`)
			// console.log(`dest col - ${JSON.stringify(destinationColumn)}`)
			// console.log(`src items - ${JSON.stringify(sourceItems)}`)
			// console.log(`dest items - ${JSON.stringify(destinationItems)}`)
			// console.log(`removed item - ${JSON.stringify(removed)}`)

			//! Setting state now

			setColumns({
				...columns,
				[source.droppableId]: {
					...sourceColumn,
					items: sourceItems,
				},
				[destination.droppableId]: {
					...destinationColumn,
					items: destinationItems,
				},
			})
		} else {
			const column = columns[source.droppableId]
			const copiedItems = [...column.items]
			const [removed] = copiedItems.splice(source.index, 1)
			copiedItems.splice(destination.index, 0, removed)
			setColumns({
				...columns,
				[source.droppableId]: {
					...column,
					items: copiedItems,
				},
			})
		}
	}

	const handleRun = () => {
		let finalCol
		let queryString = ""
		Object.entries(columns).map(([columnId, column], index) => {
			if (column.name === "Final Query") {
				finalCol = column
			}
		})

		finalCol.items.map((item, index) => {
			// console.log(item.content)
			queryString += item.content + " "
		})

		console.log(`query string :- ${queryString}`)

		queryString = queryManipulation(queryString)

		Axios.post("http://localhost:3005/api/getData", {
			query: queryString,
		}).then((response) => {
			if (response.data === "") {
				alert("Enter correct query.")
				handleReset()
			} else {
				setGlobalResult(response.data)
			}
			// console.log(response.data)
		})
	}

	const handleCtxMenu = async (e) => {
		if (e.target.innerText !== "*") return
		e.preventDefault()
		const fullData = await Axios.post("http://localhost:3005/api/getData", {
			query: "SELECT * FROM EMPLOYEES",
		})

		const cols = fullData.data.metaData
		console.log(cols)
		cols.map((item) => {
			itemsFromBackend.push({
				id: uuid(),
				content: item.name,
			})
		})

		const columnArray = Object.entries(columns)
		// console.log(items)

		//? Debugging purposes only
		// console.log(columnArray)
		// console.log(`src uuid : ${columnArray[0][0]}`)
		// console.log(`dest uuid: ${columnArray[1][0]}`)
		// console.log(`dest items : ${columnArray[0][1].items}`)
		// console.log(JSON.stringify(columnArray[1][1]))
		const myCols = {
			...columns,
			[columnArray[0][0]]: {
				...columnArray[0][1],
				items: itemsFromBackend,
			},
			[columnArray[1][0]]: {
				...columnArray[1][1],
				items: [],
			},
		}
		setColumns(myCols)

		console.log(columns)
	}

	const queryManipulation = (query) => {
		let firstAttr = query.indexOf("SELECT") + 7
		let lastAttr = query.indexOf("FROM") - 2

		//? For debugging purposes only
		// console.log(`first attribut :- ${query.charAt(firstAttr)}`)
		// console.log(`last attribute :- ${query.charAt(lastAttr)}`)

		if (query.charAt(firstAttr) === "*") return query

		let oldAttributes = query.slice(firstAttr, lastAttr + 1)
		let newAttributes = oldAttributes.replaceAll(" ", ", ")
		query = query.replace(oldAttributes, newAttributes)

		// console.log(`not substring :- ${query.slice(firstAttr, lastAttr + 1)}`)

		return query
	}

	const handleReset = () => {
		setGlobalResult(undefined)
		setColumns(initialColumns)
		console.log(initialColumns)
	}

	return (
		<>
			<div className="main">
				<DragDropContext onDragEnd={dragEnd}>
					{Object.entries(columns).map(([columnId, column], index) => {
						return (
							<div className="column" key={columnId}>
								<h2>{column.name}</h2>
								<div className="innerContent">
									<Droppable droppableId={columnId} key={columnId}>
										{(provided, snapshot) => {
											return (
												<div
													{...provided.droppableProps}
													ref={provided.innerRef}
													className="reallyInnerContent"
												>
													{column.items.map((item, index) => {
														return (
															<Draggable
																key={item.id}
																draggableId={item.id}
																index={index}
															>
																{(provided, snapshot) => {
																	return (
																		<div
																			ref={provided.innerRef}
																			{...provided.dragHandleProps}
																			{...provided.draggableProps}
																			style={{
																				color: "white",
																				...provided.draggableProps.style,
																			}}
																			className="reallyReallyInnerContent"
																			onContextMenu={handleCtxMenu}
																		>
																			{item.content}
																		</div>
																	)
																}}
															</Draggable>
														)
													})}
													{provided.placeholder}
												</div>
											)
										}}
									</Droppable>
								</div>
							</div>
						)
					})}
				</DragDropContext>
			</div>
			<div className="buttonHolder">
				<button id="submitBtn" onClick={handleRun} className="btn btn-success">
					Run!
				</button>
				<button id="resetBtn" onClick={handleReset} className="btn btn-danger">
					Reset!
				</button>
			</div>
			{globalResult && <DataTable data={globalResult} />}
		</>
	)
}
