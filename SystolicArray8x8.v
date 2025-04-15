/////////////////////////////////////////////////////////////////////////
// Module: SystolicArray8x8
// A systolic array of 8x8 processing elements. The inputs
// (left_in and top_in) and the output (result) are flattened.
//   - left_in:  8 signed numbers concatenated in order (element 0 is in 
//               the least-significant DATA_WIDTH bits).
//   - top_in:   8 signed numbers (same ordering as left_in).
//   - result:   64 signed outputs arranged in row‑major order (row0's first
//               element is in the least-significant ACC_WIDTH bits).
/////////////////////////////////////////////////////////////////////////
module SystolicArray8x8 #(parameter DATA_WIDTH = 8, parameter ACC_WIDTH = 16)
(
    input                      clk,
    input                      reset,
    input  signed [DATA_WIDTH*8-1:0] left_in,  // flattened vector: 8 elements
    input  signed [DATA_WIDTH*8-1:0] top_in,   // flattened vector: 8 elements
    output       signed [ACC_WIDTH*64-1:0] result  // flattened 8x8 outputs
);

  // Split the flattened left_in and top_in into internal arrays.
  wire signed [DATA_WIDTH-1:0] left_in_array [0:7];
  wire signed [DATA_WIDTH-1:0] top_in_array  [0:7];
  genvar k;
  generate
    for (k = 0; k < 8; k = k + 1) begin : split_input
      assign left_in_array[k] = left_in[DATA_WIDTH*(k+1)-1: DATA_WIDTH*k];
      assign top_in_array[k]  = top_in[DATA_WIDTH*(k+1)-1: DATA_WIDTH*k];
    end
  endgenerate

  // Intermediate nets for inter-PE communication.
  wire signed [DATA_WIDTH-1:0] a_wire [0:63];
  wire signed [DATA_WIDTH-1:0] b_wire [0:63];
  wire signed [ACC_WIDTH-1:0]  pe_result [0:63];

  genvar i, j;
  generate 
    for (i = 0; i < 8; i = i + 1) begin : ROW
      for (j = 0; j < 8; j = j + 1) begin : COL
         // For each PE:
         // - a_in: if column==0, use left_in_array[i]; otherwise use the PE’s left output.
         // - b_in: if row==0, use top_in_array[j]; otherwise use the PE above.
         wire signed [DATA_WIDTH-1:0] a_in_val;
         wire signed [DATA_WIDTH-1:0] b_in_val;
         
         if (j == 0)
             assign a_in_val = left_in_array[i];
         else
             assign a_in_val = a_wire[i*8 + j - 1];

         if (i == 0)
             assign b_in_val = top_in_array[j];
         else
             assign b_in_val = b_wire[(i-1)*8 + j];

         // Instantiate the processing element.
         PE #(DATA_WIDTH, ACC_WIDTH) pe_inst (
             .clk(clk),
             .reset(reset),
             .a_in(a_in_val),
             .b_in(b_in_val),
             .a_out(a_wire[i*8 + j]),
             .b_out(b_wire[i*8 + j]),
             .c_out(pe_result[i*8 + j])
         );
      end
    end
  endgenerate

  // Flatten the outputs from all PEs into the output vector "result".
  genvar idx;
  generate
    for (idx = 0; idx < 64; idx = idx + 1) begin : flatten_result
      assign result[(idx+1)*ACC_WIDTH-1: idx*ACC_WIDTH] = pe_result[idx];
    end
  endgenerate

endmodule
