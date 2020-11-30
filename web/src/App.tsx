import {
  Button,
  ButtonGroup,
  createStyles,
  Fab,
  Grid,
  makeStyles,
  Paper,
  Theme,
  Typography,
} from "@material-ui/core";
import { Add as AddIcon } from "@material-ui/icons";
import React from "react";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      display: "flex",
      height: "100vh",
    },
    totalContainer: {
      textAlign: "center",
      padding: theme.spacing(5),
    },
    total: {
      ...theme.typography.subtitle1,
      color: theme.palette.text.secondary,
    },
    balance: {
      ...theme.typography.h3,
    },
    filterSelector: {
      margin: "0 auto",
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(3),
    },
    expensesContainer: {
      height: "60%",
      display: "flex",
      marginTop: "auto",
    },
    expensesList: {
      overflowY: "auto",
    },
    expensesItem: {
      display: "flex",
      justifyContent: "space-between",
      padding: theme.spacing(3),
    },
    expenses: {
      display: "flex",
      flexDirection: "column",
      flexGrow: 1,
      padding: theme.spacing(3),
      borderRadius: "40px 40px 0 0",
    },
    fab: {
      position: "absolute",
      bottom: theme.spacing(2),
      right: theme.spacing(2),
    },
  })
);

function App() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid container>
        <Grid item xs={12} className={classes.totalContainer}>
          <Typography className={classes.total}>Total Balance</Typography>
          <Typography className={classes.balance}>$250.00</Typography>
        </Grid>
        <Grid item xs={12} className={classes.expensesContainer}>
          <Paper className={classes.expenses}>
            <ButtonGroup variant="contained" className={classes.filterSelector}>
              <Button>All</Button>
              <Button>Income</Button>
              <Button>Expenses</Button>
            </ButtonGroup>
            <div className={classes.expensesList}>
              {[...new Array(10)].map(() => (
                <div className={classes.expensesItem}>
                  <Typography>Food</Typography>
                  <Typography>-$30.00</Typography>
                </div>
              ))}
            </div>
          </Paper>
        </Grid>
        <Fab aria-label="Add" size="medium" className={classes.fab}>
          <AddIcon />
        </Fab>
      </Grid>
    </div>
  );
}

export default App;
