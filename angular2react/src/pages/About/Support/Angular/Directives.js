const directives = [
  { name: "*ngIf", link: "https://angular.io/api/common/NgIf" },
  { name: "*ngFor", link: "https://angular.io/api/common/NgForOf" },
  {
    name: "ngClass",
    link: "https://angular.io/api/common/NgClass",
  },
  {
    name: "ngStyle",
    link: "https://angular.io/api/common/NgStyle",
  },
  {
    name: "ngSwitch",
    link: "https://angular.io/api/common/NgSwitch",
  },
];

const Directives = (props) => {
  return (
    <>
      <div className="arrow-down"></div>
      <div
        className="column-expanded directive"
        onMouseEnter={props.mouseEnter}
        onMouseLeave={props.mouseLeave}
      >
        {directives.map((dir, index) => {
          return (
            <li key={`dir${index}`}>
              <a href={dir.link} target="_blank" rel="noreferrer">
                {dir.name}
              </a>
            </li>
          );
        })}
      </div>
    </>
  );
};

export default Directives;
