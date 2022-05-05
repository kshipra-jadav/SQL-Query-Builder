import './App.css';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import data from './data.json'
import { useState } from 'react';

function App() {
  const [baseList, setBaseList] = useState(data)
  const dragEnd = (result) => {
    console.log(result)
  }
  return (
    <DragDropContext onDragEnd={dragEnd}>
      <div className = "mainContainer">
        <div className = "container1">
          <Droppable droppableId='baseList'>
            {
              (provided, snapshot) => {
                return(
                  <div ref = {provided.innerRef} {...provided.droppableProps}>
                    {
                      baseList.map((item, index) => {
                        return(
                          <Draggable draggableId={item.id} key = {item.id} index = {index} >
                            {
                              (provided, snapshot) => {
                                return(
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className = "qBox"
                                  >
                                    {item.text} 
                                  </div>
                                )
                              }
                            }
                          </Draggable>
                        )
                      })
                    }
                    {provided.placeholder}
                  </div>
                )
              }
            }
          </Droppable>
        </div>
        <div className = "container2">
          <h1>Hello</h1>
        </div>
      </div>
    </DragDropContext>
  );
}

export default App;
