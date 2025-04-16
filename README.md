# TPU-Style 8×8 Systolic Array for Matrix Multiplication

This project implements and simulates a TPU-inspired 8×8 systolic array accelerator in Verilog for matrix multiplication. The design focuses on accelerating deep learning computations by efficiently processing matrix operations using a systolic array architecture. In this design, **matrix A** (treated as the “weight” matrix) is fed horizontally from the left, and **matrix B** (treated as the “data” matrix) is fed vertically from the top.

[Project Website](http://tpu-xi.vercel.app/)

## Overview

The systolic array comprises 64 Processing Elements (PEs) arranged in an 8×8 grid. Each PE performs signed multiply-and-accumulate (MAC) operations in a pipelined fashion. The design capitalizes on parallelism and data reuse within the array to achieve a significant speedup over sequential processing.

Key points:
- **Directional Data Feed:** Matrix A is streamed in row-wise (from the left) and matrix B is streamed in column-wise (from the top).
- **Parallel MAC Operations:** Each of the 64 PEs processes a portion of the overall matrix multiplication concurrently.
- **Efficient Data Reuse:** Once the data is loaded, values propagate through the array, reducing the need for repeated memory access.
- **Scalability:** While implemented as an 8×8 array for educational purposes, the approach can be scaled to larger matrices.

## Project Structure

- **Processing Element (PE):**  
  Each PE is designed to accept one element each from matrix A and matrix B, performs a multiplication, and adds the result to a running sum stored in an accumulator. It then forwards the A value to the right and the B value downward.

- **8×8 Systolic Array (SystolicArray8x8):**  
  An 8×8 mesh of PEs is interconnected such that:
  - The leftmost column receives the matrix A values.
  - The topmost row receives the matrix B values.
  
  The array computes the output matrix by propagating a wavefront of data through the grid.

- **Top-Level Module (MatMul8x8_Top):**  
  This module integrates the systolic array with external interfaces. It feeds input matrices into the array using directional queues (row-wise for A and column-wise for B) and collects the output matrix from the array after computation.

- **Testbench (tb_MatMul8x8):**  
  A Verilog testbench is provided to simulate and verify the functionality of the design. It initializes two 8×8 matrices, drives the simulation (including clock and reset signals), and compares the computed result against the expected matrix product.

## Simulation and Results

The design was simulated using a Verilog simulator with a clock period (e.g., 10 ns). Key observations during the simulation include:

- **Wavefront Data Propagation:**  
  Data streams into the array and moves in a synchronized wave-like pattern. After an initial latency, each PE correctly performs its MAC operations.

- **Correctness Verification:**  
  By testing with matrices containing a mix of positive and negative values, the simulation confirmed that the output matrix matches the expected product. For example, if an identity matrix is used for A, the result matrix C exactly equals matrix B.

- **Performance Efficiency:**  
  Once the pipeline was filled, the systolic array produced one valid output per clock cycle. Overall, the matrix multiplication operation was completed in roughly 15 cycles (plus pipeline flush), demonstrating considerable performance improvements over sequential implementations.

## Future Enhancements

Several future directions have been identified:

- **Support for Larger Matrices:**  
  Extending the array size (or tiling multiple 8×8 arrays) to accommodate larger matrix sizes.

- **Enhanced Arithmetic Precision:**  
  Upgrading from 8-bit fixed-point arithmetic to higher bit-widths or even floating-point operations.

- **FPGA Implementation:**  
  Deploying the design on FPGA hardware to evaluate real-world performance and power efficiency.

- **Improved Memory Interfaces:**  
  Integrating DMA controllers or standard bus interfaces (e.g., AXI) to enable effective communication with host memory.

- **Continuous Pipelining:**  
  Modifying control logic to support back-to-back matrix multiplication tasks with minimal idle cycles, suitable for batched neural network computations.

## Conclusion

This project successfully demonstrates a TPU-style systolic array for matrix multiplication. By feeding matrix A from the left and matrix B from the top, the design maximizes data reuse and parallelism. The simulation results validate both the correctness of the computation and the performance benefit of using a systolic array structure.
