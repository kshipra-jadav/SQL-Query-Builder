import { Component } from "react"
import "bootstrap/dist/css/bootstrap.min.css"
import "./DataTable.css"

export default function DataTable({ data }) {
	const metaData = data.metaData
	const rows = data.rows

	return (
		<>
			<div className="tableWrapper">
				<table className="table table-striped table-bordered table-dark dataTable">
					<thead>
						<tr>
							{metaData.map((item, index) => {
								return <th>{item.name}</th>
							})}
						</tr>
					</thead>
					<tbody>
						{rows.map((row) => {
							return <TableRow row={row} />
						})}
					</tbody>
				</table>
			</div>
		</>
	)
}

class TableRow extends Component {
	render() {
		let row = this.props.row
		return (
			<tr>
				{row.map((val) => {
					return <td>{val}</td>
				})}
			</tr>
		)
	}
}
