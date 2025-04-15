/////////////////////////////////////////////////////////////////////////
// Module: MatMul8x8_Top
// Top-level module for performing an 8x8 matrix multiplication using
// the systolic array. The two input matrices (A_matrix and B_matrix)
// are provided as flattened vectors of 64 elements (each element is DATA_WIDTH),
// and the output matrix C_matrix is a flattened vector of 64 elements (each element is ACC_WIDTH).
//
// NOTE: The state machine has been modified to start feeding matrix data
// immediately when 'start' is asserted (i.e. no separate LOAD state). This
// ensures that feeding begins at cycle 0 and that every PE receives all 8 valid updates.
/////////////////////////////////////////////////////////////////////////
module MatMul8x8_Top #(parameter DATA_WIDTH = 8, parameter ACC_WIDTH = 16)
(
    input                   clk,
    input                   reset,
    input                   start,
    input  signed [DATA_WIDTH*64-1:0] A_matrix, // flattened, row-major order
    input  signed [DATA_WIDTH*64-1:0] B_matrix, // flattened, row-major order
    output reg              done,
    output       signed [ACC_WIDTH*64-1:0] C_matrix // flattened result matrix
);

  // Define states: IDLE, COMPUTE, FINISH.
  parameter IDLE    = 2'b00,
            COMPUTE = 2'b01,
            FINISH  = 2'b10;
  reg [1:0] curr_state, next_state;
  reg [5:0] cycle_count;  // counts the feeding cycles (starting at 0)
  
  // The reset_sync signal is not needed for a separate LOAD state now.
  
  // State machine updating state and cycle count.
  always @(posedge clk or posedge reset) begin
    if (reset) begin
      curr_state  <= IDLE;
      cycle_count <= 0;
      done        <= 0;
    end else begin
      curr_state  <= next_state;
      if (curr_state == COMPUTE)
         cycle_count <= cycle_count + 1;
      else
         cycle_count <= 0;
      done <= (curr_state == FINISH);
    end
  end
  
  // Next-state logic:
  // - From IDLE, if 'start' is asserted, immediately enter COMPUTE.
  // - Remain in COMPUTE until cycle_count reaches 23 (to flush the pipeline).
  // - Then transition to FINISH.
  always @(*) begin
    case (curr_state)
      IDLE:    next_state = (start) ? COMPUTE : IDLE;
      COMPUTE: next_state = (cycle_count >= 21) ? FINISH : COMPUTE;
      FINISH:  next_state = FINISH;
      default: next_state = IDLE;
    endcase
  end
  
  // -----------------------------------------------------------
  // Input selection for the systolic array: extract one element at a time
  // from the flattened matrices.
  // -----------------------------------------------------------
  function signed [DATA_WIDTH-1:0] get_matrix_value;
    input [DATA_WIDTH*64-1:0] matrix;
    input integer index; // index from 0 to 63
    reg [DATA_WIDTH*64-1:0] shifted;
    begin
      shifted = matrix >> (index * DATA_WIDTH);
      get_matrix_value = shifted[DATA_WIDTH-1:0];
    end
  endfunction
  
  // Internal arrays for left and top input values.
  reg signed [DATA_WIDTH-1:0] left_in_array [0:7];
  reg signed [DATA_WIDTH-1:0] top_in_array  [0:7];
  integer i;
  always @(*) begin
    // Default to zeros.
    for (i = 0; i < 8; i = i + 1) begin
      left_in_array[i] = 0;
      top_in_array[i]  = 0;
    end
    if (curr_state == COMPUTE) begin
      // For each row 'i', feed A_matrix[i][cycle_count - i] when valid.
      for (i = 0; i < 8; i = i + 1) begin
        if ((cycle_count >= i) && (cycle_count <= i+7))
          left_in_array[i] = get_matrix_value(A_matrix, i*8 + (cycle_count - i));
      end
      // For each column 'j', feed B_matrix[cycle_count - j][j] when valid.
      for (i = 0; i < 8; i = i + 1) begin
        if ((cycle_count >= i) && (cycle_count <= i+7))
          top_in_array[i] = get_matrix_value(B_matrix, (cycle_count - i)*8 + i);
      end
    end
  end
  
  // Flatten left_in_array and top_in_array into 8-element vectors.
  reg signed [DATA_WIDTH*8-1:0] flat_left_in;
  reg signed [DATA_WIDTH*8-1:0] flat_top_in;
  always @(*) begin
    flat_left_in = { left_in_array[7], left_in_array[6], left_in_array[5],
                     left_in_array[4], left_in_array[3], left_in_array[2],
                     left_in_array[1], left_in_array[0] };
    flat_top_in  = { top_in_array[7], top_in_array[6], top_in_array[5],
                     top_in_array[4], top_in_array[3], top_in_array[2],
                     top_in_array[1], top_in_array[0] };
  end
  
  // Instantiate the systolic array.
  wire signed [ACC_WIDTH*64-1:0] flat_result;
  SystolicArray8x8 #(DATA_WIDTH, ACC_WIDTH) systolic_inst (
      .clk(clk),
      .reset(reset),  // using the same reset (only active during initial cycle)
      .left_in(flat_left_in),
      .top_in(flat_top_in),
      .result(flat_result)
  );
  
  // Drive the output matrix.
  assign C_matrix = flat_result;
  
endmodule