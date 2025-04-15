/////////////////////////////////////////////////////////////////////////
// Module: PE (Processing Element)
// Multiply two signed inputs and accumulate the result.
/////////////////////////////////////////////////////////////////////////
module PE #(parameter DATA_WIDTH = 8, parameter ACC_WIDTH = 16)
(
    input                    clk,
    input                    reset,
    input  signed [DATA_WIDTH-1:0] a_in,
    input  signed [DATA_WIDTH-1:0] b_in,
    output reg signed [DATA_WIDTH-1:0] a_out,
    output reg signed [DATA_WIDTH-1:0] b_out,
    output       signed [ACC_WIDTH-1:0] c_out
);
  reg signed [ACC_WIDTH-1:0] acc;
  
  always @(posedge clk) begin
    if (reset) begin
      acc   <= 0;
      a_out <= 0;
      b_out <= 0;
    end else begin
      acc   <= acc + (a_in * b_in);
      a_out <= a_in;
      b_out <= b_in;
    end
  end
  assign c_out = acc;
endmodule



