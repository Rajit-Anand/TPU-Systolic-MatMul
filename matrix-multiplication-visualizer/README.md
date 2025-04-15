# Matrix Multiplication Visualizer

An interactive web application that visualizes and compares different approaches to matrix multiplication using CPU, GPU, and TPU architectures.

## Overview

This project provides an educational tool to understand the fundamental differences between various hardware architectures for matrix multiplication, a core operation in many computational tasks including deep learning, computer graphics, and scientific computing.

The visualizer demonstrates:

- **CPU** implementation using sequential processing (triple nested loop)
- **GPU** implementation using massively parallel processing
- **TPU** implementation using a systolic array architecture

Each implementation is animated step-by-step to show how the matrices are processed and how the results accumulate over time.

## Features

- **Interactive Visualizations**: Step through each cycle of matrix multiplication for all three architectures
- **Side-by-side Comparison**: Compare performance, power efficiency, and other key metrics
- **Detailed Explanations**: Learn about the inner workings of each architecture
- **Responsive Design**: Works on desktop and mobile devices

## Getting Started

### Prerequisites

- Node.js and npm installed on your system

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/matrix-multiplication-visualizer.git
   cd matrix-multiplication-visualizer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## How It Works

### CPU Visualization

The CPU visualization shows the traditional approach to matrix multiplication using three nested loops. Each element of the output matrix is calculated sequentially, one at a time. For an 8×8 matrix, this requires 512 cycles.

### GPU Visualization

The GPU visualization demonstrates how graphics processing units perform matrix multiplication in parallel. Each element of the output matrix is computed concurrently by its own thread. For an 8×8 matrix, this requires only 8 cycles.

### TPU Visualization

The TPU (Tensor Processing Unit) visualization shows the systolic array approach used by Google's custom AI accelerators. Data flows through a grid of processing elements in a synchronized pattern, with each element performing a multiply-accumulate operation. This approach is highly energy-efficient and takes approximately 22 cycles for an 8×8 matrix.

## Built With

- [React](https://reactjs.org/) - Frontend framework
- [CSS3](https://developer.mozilla.org/en-US/docs/Web/CSS) - Styling
- [Font Awesome](https://fontawesome.com/) - Icons

## Learning Resources

- [Matrix Multiplication on Wikipedia](https://en.wikipedia.org/wiki/Matrix_multiplication)
- [CUDA by Example](https://developer.nvidia.com/cuda-example) - For GPU computing
- [Google's TPU Paper](https://arxiv.org/abs/1704.04760) - In-depth explanation of TPU architecture
- [Systolic Arrays](https://en.wikipedia.org/wiki/Systolic_array) - Background on the systolic array architecture

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by the growing importance of matrix operations in deep learning
- Based on the Verilog TPU implementation and Python simulation scripts
- Visualization techniques adapted from educational resources on computer architecture
