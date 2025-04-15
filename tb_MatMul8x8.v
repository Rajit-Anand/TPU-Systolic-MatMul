`timescale 1ns/1ps

/////////////////////////////////////////////////////////////////////////
// Testbench: tb_MatMul8x8
// starts the computation, and prints the resulting matrix.
/////////////////////////////////////////////////////////////////////////
module tb_MatMul8x8;
  parameter DW = 8;
  parameter AW = 16;
  
  reg clk;
  reg reset;
  reg start;
  // Flattened matrices: 64 elements each.
  reg  signed [DW*64-1:0] flat_A_mat;
  reg  signed [DW*64-1:0] flat_B_mat;
  wire signed [AW*64-1:0] flat_C_mat;
  wire done;
  
  // Instantiate the top-level module.
  MatMul8x8_Top #(DW, AW) dut (
      .clk(clk),
      .reset(reset),
      .start(start),
      .A_matrix(flat_A_mat),
      .B_matrix(flat_B_mat),
      .done(done),
      .C_matrix(flat_C_mat)
  );
  
  // Clock generation: 10 ns period.
  initial clk = 0;
  always #5 clk = ~clk;
  
  // Helper function to extract one 16-bit element from the flattened result.
  function [AW-1:0] get_C_val;
    input integer index;
    reg [AW*64-1:0] shifted;
    begin
      shifted = flat_C_mat >> (index * AW);
      get_C_val = shifted[AW-1:0];
    end
  endfunction
  
  integer i;
  initial begin
    // Initialize the matrices: every element = 1.
    reset = 1;
    start = 0;
    flat_A_mat = {
    8'd1,  8'd2,  8'd3,  8'd4,  8'd5,  8'd6,  8'd7,  8'd8,   // Row 1
    8'd8,  8'd7,  8'd6,  8'd5,  8'd4,  8'd3,  8'd2,  8'd1,   // Row 2
    8'd1,  8'd3,  8'd5,  8'd7,  8'd9,  8'd11, 8'd13, 8'd15,  // Row 3
    8'd2,  8'd4,  8'd6,  8'd8,  8'd10, 8'd12, 8'd14, 8'd16,  // Row 4
    8'd16, 8'd14, 8'd12, 8'd10, 8'd8,  8'd6,  8'd4,  8'd2,   // Row 5
    8'd15, 8'd13, 8'd11, 8'd9,  8'd7,  8'd5,  8'd3,  8'd1,   // Row 6
    8'd1,  8'd1,  8'd2,  8'd2,  8'd3,  8'd3,  8'd4,  8'd4,   // Row 7
    8'd4,  8'd4,  8'd3,  8'd3,  8'd2,  8'd2,  8'd1,  8'd1    // Row 8
    };

    flat_B_mat = {
    8'd1, 8'd0, 8'd1, 8'd0, 8'd1, 8'd0, 8'd1, 8'd0,   // Row 1
    8'd0, 8'd1, 8'd0, 8'd1, 8'd0, 8'd1, 8'd0, 8'd1,   // Row 2
    8'd1, 8'd0, 8'd1, 8'd0, 8'd1, 8'd0, 8'd1, 8'd0,   // Row 3
    8'd0, 8'd1, 8'd0, 8'd1, 8'd0, 8'd1, 8'd0, 8'd1,   // Row 4
    8'd1, 8'd0, 8'd1, 8'd0, 8'd1, 8'd0, 8'd1, 8'd0,   // Row 5
    8'd0, 8'd1, 8'd0, 8'd1, 8'd0, 8'd1, 8'd0, 8'd1,   // Row 6
    8'd1, 8'd0, 8'd1, 8'd0, 8'd1, 8'd0, 8'd1, 8'd0,   // Row 7
    8'd0, 8'd1, 8'd0, 8'd1, 8'd0, 8'd1, 8'd0, 8'd1    // Row 8
    };

    #12;
    reset = 0;
    start = 1; 
    #10;
    start = 0;
    // Wait until computation is done.
    wait(done);
    #10;
    $display("Matrix multiplication completed. Output matrix C:");
    // Print the result matrix (8 rows x 8 columns).
    for (i = 63; i >= 0; i = i - 1) begin
      $write("%0d ", get_C_val(i));
      if ((i % 8) == 0)
         $write("\n");
    end

    $display("Test completed.");
    $finish;
  end
endmodule