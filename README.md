# Kraken Bot
A bot for Kraken that trades using the HODL strategy

Strategy:\
Check the 24h high for the asset:\
\> if (below 2% of 24 high and no recent order) or (below 2% of last buy order made within 24h and open orders < maxTrades):\
&nbsp;&nbsp;&nbsp;&nbsp;\> open buy order at market and open sell order at current price + 2%\
\> otherwise do nothing.

You should only trade on coins which you wish to HODL on, since it is part of the strategy.
### Comes with a minimal web dashboard
