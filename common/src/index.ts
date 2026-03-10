// export the interface so it can be imported by other packages
export interface Color {
    red: number;
    blue: number;
    green: number;
}

// give the constant a less‑generic name if you like
const defaultColor: Color = {
    red: 20,
    blue: 10,
    green: 10
};

export default defaultColor;