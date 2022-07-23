const components = [
  {
    name: "Basic Components",
    link: "https://angular.io/guide/architecture-components",
  },
  {
    name: "Input & Output",
    link: "https://angular.io/guide/inputs-outputs",
  },
  {
    name: "Event Emitters",
    link: "https://angular.io/api/core/EventEmitter",
  },
  {
    name: "ViewChild",
    link: "https://angular.io/api/core/ViewChild",
  },
  {
    name: "ViewEncapsulation",
    link: "https://angular.io/api/core/ViewEncapsulation",
  },
];

const Components = (props) => {
  return (
    <>
      <div className="arrow-down"></div>
      <div
        className="column-expanded component"
        onMouseEnter={props.mouseEnter}
        onMouseLeave={props.mouseLeave}
      >
        {components.map((comp, index) => {
          return (
            <li key={`comp${index}`}>
              <a href={comp.link} target="_blank" rel="noreferrer">
                {comp.name}
              </a>
            </li>
          );
        })}
      </div>
    </>
  );
};

export default Components;
