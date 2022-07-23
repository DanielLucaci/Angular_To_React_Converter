const binding = [
  {
    name: "Property Binding",
    link: "https://angular.io/guide/property-binding",
  },
  {
    name: "Event Binding",
    link: "https://angular.io/guide/event-binding",
  },
  {
    name: "Two Way Binding",
    link: "https://angular.io/guide/two-way-binding",
  },
];

const Binding = (props) => {
  return (
    <>
      <div className="arrow-down"></div>
      <div
        className="column-expanded binding"
        onMouseEnter={props.mouseEnter}
        onMouseLeave={props.mouseLeave}
      >
        {binding.map((bind, index) => {
          return (
            <li key={`bind${index}`}>
              <a href={bind.link} target="_blank" rel="noreferrer">
                {bind.name}
              </a>
            </li>
          );
        })}
      </div>
    </>
  );
};

export default Binding;
