import { render, screen } from '@testing-library/react';
import {SignIn} from './App'

test('verificar el signin', () => {
    render(<SignIn/>)  // render = permite renderizar  
    expect(screen.queryByText("cualquier cosa")).toBeNull(); // toBeNull() = verificar que dentro del sign hay un nulo
    expect(screen.queryByText("Bienvenido a sofka")).toBeInTheDocument(); //toBeInTheDocument = comparador, que se puede usar para afirmar que un elemento está en el cuerpo del documento o no
})