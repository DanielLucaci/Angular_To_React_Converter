import styled from 'styled-components';

const Spinner = styled.div`
    background: url('/assets/spinner.png') fixed no-repeat top center;
    height: 280px;
    width: 280px;
    margin: 100px auto 60px auto;
    display: block;
    animation: rotation 6s infinite linear;

    @keyframes rotation {
        from {
            transform: rotate(0deg);
        }
        to { 
            transform: rotate(359deg);
        }
    }
`;

export default Spinner;